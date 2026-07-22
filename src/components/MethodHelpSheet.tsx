import type { ComponentType } from "react";
import type { InputMethod } from "../lib/incomeCheck";
import { IncomeHelpSheet } from "./IncomeHelpSheet";
import { PensionHelpSheet } from "./PensionHelpSheet";
import { WageHelpSheet } from "./WageHelpSheet";

interface HelpSheetProps {
  open: boolean;
  onClose: () => void;
}

const SHEET_BY_METHOD: Record<InputMethod, ComponentType<HelpSheetProps>> = {
  health: IncomeHelpSheet,
  pension: PensionHelpSheet,
  wage: WageHelpSheet,
};

/** 산정 기준(method)에 맞는 확인방법 도움말 시트를 선택해 렌더. */
export function MethodHelpSheet({ method, open, onClose }: HelpSheetProps & { method: InputMethod }) {
  const Sheet = SHEET_BY_METHOD[method];
  return <Sheet open={open} onClose={onClose} />;
}
