import { useState } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇨🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

interface LanguageSwitcherProps {
  compact?: boolean;
  tiny?: boolean;
}

export const LanguageSwitcher = ({
  compact = false,
  tiny = false,
}: LanguageSwitcherProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0],
  );

  return (
    <div
      className={`relative inline-flex items-center bg-muted ${
        tiny
          ? "gap-0.5 p-0.5 rounded-md"
          : compact
            ? "gap-0.5 p-0.5 rounded-md"
            : "gap-1 p-1 rounded-lg"
      }`}
    >
      <div
        className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: "calc(50% - 4px)",
          transform: `translateX(${
            selectedLanguage.code === languages[0].code
              ? "0"
              : "calc(100% + 8px)"
          })`,
        }}
      />
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => setSelectedLanguage(language)}
          className={`relative z-10 inline-flex items-center justify-center cursor-pointer transition-colors ${
            tiny
              ? "gap-1 px-1.5 py-1 min-w-[58px]"
              : compact
                ? "gap-1 px-2 py-1 min-w-[72px]"
                : "gap-2 px-4 py-2 min-w-[120px]"
          }`}
        >
          <span className={tiny ? "text-xs" : compact ? "text-sm" : "text-xl"}>
            {language.flag}
          </span>
          <span
            className={`${
              tiny ? "text-[9px]" : compact ? "text-[10px]" : "text-sm"
            } font-medium transition-colors ${
              selectedLanguage.code === language.code
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {language.name}
          </span>
        </button>
      ))}
    </div>
  );
};
