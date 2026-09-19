import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiRequest } from "../services/api.js";
import { previewMode } from "../services/events.js";

export const useEventActions = (event, content, setEvent) => {
  const id = event._id;
  const { language } = useLanguage();
  const { user, token } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const ended = new Date(event.date).getTime() <= Date.now();
  const attending = event.attendees.some(
    (attendee) => (attendee._id || attendee) === user?.id,
  );
  const toggle = async () => {
    if (previewMode || actionLoading || (ended && !attending)) return;
    if (!user)
      return navigate("/auth", {
        state: {
          from: `/events/${id}`,
        },
      });
    setActionLoading(true);
    try {
      const response = await apiRequest(`/events/${id}/attendance`, {
        method: "POST",
        body: { language },
        token,
      });
      setEvent({
        ...event,
        attendees: response.data.attendees,
      });
      notify(response.message);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };
  const share = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          url: location.href,
        });
      } else {
        await navigator.clipboard.writeText(location.href);
        notify("Enlace copiado para compartir.");
      }
    } catch (shareError) {
      if (shareError.name !== "AbortError")
        notify("No hemos podido compartir el enlace.", "error");
    } finally {
      setSharing(false);
    }
  };
  return { user, ended, attending, actionLoading, sharing, toggle, share };
};
