import { useEffect, useRef, useCallback } from "react";

// Custom Stream channel event types used to sync the shared code editor.
const CODE_EVENT = "code-update";
const LANG_EVENT = "language-update";

/**
 * Real-time collaborative editing over the existing Stream chat channel.
 *
 * Both users in a session share the same channel (keyed by callId). When one
 * user types, we broadcast the new code as a custom channel event; the other
 * user receives it and applies it to their editor. The same is done for the
 * selected language.
 *
 * To avoid feedback loops, we ignore events that originated from the current
 * user, and we set an "applying remote update" flag so the editor's onChange
 * does not re-broadcast a change we just received.
 *
 * @param {object} channel        Stream channel instance (from useStreamClient)
 * @param {string} currentUserId  The current user's stream/clerk id
 * @param {function} onRemoteCode  Called with new code when a remote user types
 * @param {function} onRemoteLanguage Called with new language on remote change
 */
function useCollaborativeCode(
  channel,
  currentUserId,
  onRemoteCode,
  onRemoteLanguage,
) {
  // True while we are applying an update received from the other user, so the
  // editor's onChange handler knows not to re-broadcast it.
  const isApplyingRemote = useRef(false);
  // Debounce timer for outgoing code events.
  const debounceRef = useRef(null);

  // Listen for remote code/language updates.
  useEffect(() => {
    if (!channel) return;

    const handleEvent = (event) => {
      // Ignore our own events.
      if (event.user?.id === currentUserId) return;

      if (event.type === CODE_EVENT && typeof event.code === "string") {
        isApplyingRemote.current = true;
        onRemoteCode(event.code);
        // Reset the flag on the next tick after the editor applies the value.
        setTimeout(() => {
          isApplyingRemote.current = false;
        }, 0);
      }

      if (event.type === LANG_EVENT && typeof event.language === "string") {
        onRemoteLanguage(event.language);
      }
    };

    channel.on(handleEvent);

    return () => {
      channel.off(handleEvent);
    };
  }, [channel, currentUserId, onRemoteCode, onRemoteLanguage]);

  // Broadcast a code change (debounced) unless it came from a remote update.
  const broadcastCode = useCallback(
    (code) => {
      if (!channel) return;
      if (isApplyingRemote.current) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        channel.sendEvent({ type: CODE_EVENT, code }).catch((err) => {
          console.error("Failed to broadcast code update:", err);
        });
      }, 300);
    },
    [channel],
  );

  // Broadcast a language change immediately (these are infrequent).
  const broadcastLanguage = useCallback(
    (language) => {
      if (!channel) return;
      if (isApplyingRemote.current) return;

      channel.sendEvent({ type: LANG_EVENT, language }).catch((err) => {
        console.error("Failed to broadcast language update:", err);
      });
    },
    [channel],
  );

  // Clean up any pending debounce on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { broadcastCode, broadcastLanguage, isApplyingRemote };
}

export default useCollaborativeCode;
