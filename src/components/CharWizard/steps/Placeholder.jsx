import { C, sx } from "../../../constants/theme.js";

export default function Placeholder({ stepId }) {
  return (
    <div style={{ ...sx.card, textAlign: "center", padding: 40, color: C.textDim }}>
      <h2 style={{ color: C.amberBright }}>🚧 Step: {stepId}</h2>
      <p>Dieser Schritt ist noch nicht implementiert.</p>
    </div>
  );
}

export const validate = () => ({ ok: true });
