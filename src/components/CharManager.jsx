import { useChar } from "../context/CharContext.jsx";
import { usePersist } from "../hooks/usePersist.js";
import CharManagerV2 from "./CharManagerV2.jsx";
import ResumeBanner from "./CharWizard/ResumeBanner.jsx";

/**
 * CharManager — Charakter-Tab wrapper.
 *
 * Everything that used to live in this component's header was moved out:
 *   - Char switching / creation / deletion → CharSwitcher in the sidebar.
 *   - Rest triggers + confirmation banner → CharHeader (visible on every tab
 *     so rests stay one click away regardless of where the user is).
 *   - Backup import → Settings modal.
 *
 * The component is deliberately thin now: it only mounts the wizard-resume
 * banner (when a half-finished wizard exists) and delegates the rest of the
 * character sheet to CharManagerV2's five sub-tabs.
 */
export default function CharManager() {
  const { active } = useChar();
  const [wizardState, setWizardState] = usePersist("wizard_active_v1", null);

  // AppRouter reads wizard_active_v1 via its own usePersist instance which
  // doesn't subscribe to storage events. A plain state set here won't
  // propagate, so we reload to make the takeover mount.
  const resumeWizard  = () => { window.location.reload(); };
  const discardWizard = () => {
    setWizardState(null);
    localStorage.removeItem("wizard_active_v1");
  };

  if (!active) return null;

  return (
    <div>
      {wizardState && (
        <ResumeBanner
          wizardState={wizardState}
          onResume={resumeWizard}
          onDiscard={discardWizard}
        />
      )}
      <CharManagerV2 />
    </div>
  );
}
