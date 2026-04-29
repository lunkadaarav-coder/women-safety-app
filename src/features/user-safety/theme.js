export const colors = {
  primary:      "#6C47FF",
  primaryLight: "#F3F0FF",
  primaryBorder:"#DDD6FE",
  bg:           "#F9F7FF",
  white:        "#FFFFFF",
  danger:       "#E53E3E",
  dangerLight:  "#FFF1F2",
  dangerBorder: "#FECDD3",
  success:      "#16A34A",
  successLight: "#EDFDF4",
  successBorder:"#BBF7D0",
  warning:      "#D97706",
  warningLight: "#FFFBEB",
  warningBorder:"#FDE68A",
  textPrimary:  "#1A1A2E",
  textMuted:    "#9CA3AF",
  textSecondary:"#6B7280",
  border:       "#EDE9FF",
  cardBg:       "#FAF9FF",
};

export const radius = {
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "24px",
  full: "999px",
};

export const font = {
  xs:   "11px",
  sm:   "12px",
  md:   "13px",
  base: "14px",
  lg:   "16px",
  xl:   "20px",
  xxl:  "24px",
};

// Reusable component styles
export const card = {
  background:   colors.cardBg,
  border:       `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding:      "14px",
  marginBottom: "12px",
};

export const pill = (type = "purple") => {
  const map = {
    purple: { background: colors.primaryLight, color: colors.primary,  border: `1px solid ${colors.primaryBorder}` },
    green:  { background: colors.successLight, color: colors.success,  border: `1px solid ${colors.successBorder}` },
    red:    { background: colors.dangerLight,  color: colors.danger,   border: `1px solid ${colors.dangerBorder}`  },
    yellow: { background: colors.warningLight, color: colors.warning,  border: `1px solid ${colors.warningBorder}` },
  };
  return {
    ...map[type],
    fontSize:     font.xs,
    fontWeight:   "700",
    padding:      "3px 9px",
    borderRadius: radius.full,
    whiteSpace:   "nowrap",
  };
};

export const avatar = (size = 36) => ({
  width:          `${size}px`,
  height:         `${size}px`,
  borderRadius:   "50%",
  background:     colors.primaryLight,
  color:          colors.primary,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontWeight:     "700",
  fontSize:       size > 40 ? "16px" : "13px",
  flexShrink:     0,
});