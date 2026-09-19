import { useLanguage } from "../../context/LanguageContext.jsx";

export const RecoveryNotice = ({ reset, notice }) => {
  const { t } = useLanguage();
  return (
    <div className="recovery-notice" ref={notice} tabIndex={-1} role="status">
      <p>
        {t(
          reset
            ? "Contraseña actualizada. Inicia sesión con tu nueva contraseña."
            : "Si existe una cuenta con ese correo y se puede enviar el mensaje, recibirás un enlace. Revisa también spam. Si ya lo has pedido, espera unos minutos.",
        )}
      </p>
      {!reset && (
        <p>
          {t(
            "El enlace caduca en 30 minutos. Solo funciona el último enlace solicitado.",
          )}
        </p>
      )}
    </div>
  );
};
