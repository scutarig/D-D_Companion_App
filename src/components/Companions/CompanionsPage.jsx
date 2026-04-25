import { C, sx, FH } from "../../constants/theme.js";
import { useChar } from "../../context/CharContext.jsx";
import { useCompanions } from "../../hooks/useCompanions.js";
import CompanionList from "./CompanionList.jsx";

export default function CompanionsPage() {
  const { aid } = useChar();
  const { companions, add, update, remove, updateHp } = useCompanions(aid);

  const alive = companions.filter((c) => c.hp > 0).length;
  const total = companions.length;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0d2218,#0a1a0e)",
        border: `1px solid ${C.green}30`,
        borderRadius: 16, padding: "18px 20px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{ fontSize: 40 }}>🐾</span>
        <div>
          <div style={{ fontFamily: FH, fontSize: 20, color: C.greenBright, fontWeight: 700, letterSpacing: 1 }}>
            Begleiter
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
            {total === 0
              ? "Noch keine Begleiter"
              : `${alive} / ${total} kampfbereit`}
          </div>
        </div>
      </div>

      {/* Companion List */}
      <CompanionList
        companions={companions}
        add={add}
        update={update}
        remove={remove}
        updateHp={updateHp}
      />
    </div>
  );
}
