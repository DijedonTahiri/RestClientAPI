import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        general: {
          title: 'General',
          language: 'Language',
          sidebar: 'Sidebar Default State'
        },
        theme: {
          title: 'Theme',
          mode: 'Theme Mode',
          light: 'Light',
          dark: 'Dark',
          system: 'System',
          accent: 'Accent Color'
        },
        sidebar: {
          expanded: 'Always Expanded',
          collapsed: 'Always Collapsed',
          auto: 'Responsive'
        },
        colors: {
          blue: 'Blue',
          purple: 'Purple',
          green: 'Green',
          red: 'Red',
          amber: 'Amber',
          pink: 'Pink'
        },
        advanced: {
          title: 'Advanced',
          version: 'Version',
          reset: 'Reset All Settings',
          resetConfirm: 'Are you sure you want to reset all settings to default?'
        }
      }
    }
  },
  es: {
    translation: {
      settings: {
        title: 'Configuración',
        general: {
          title: 'General',
          language: 'Idioma',
          sidebar: 'Estado Predeterminado de la Barra Lateral'
        },
        theme: {
          title: 'Tema',
          mode: 'Modo de Tema',
          light: 'Claro',
          dark: 'Oscuro',
          system: 'Sistema',
          accent: 'Color de Acento'
        },
        sidebar: {
          expanded: 'Siempre Expandido',
          collapsed: 'Siempre Contraído',
          auto: 'Responsivo'
        },
        colors: {
          blue: 'Azul',
          purple: 'Morado',
          green: 'Verde',
          red: 'Rojo',
          amber: 'Ámbar',
          pink: 'Rosa'
        },
        advanced: {
          title: 'Avanzado',
          version: 'Versión',
          reset: 'Restablecer Configuración',
          resetConfirm: '¿Estás seguro de que deseas restablecer toda la configuración?'
        }
      }
    }
  },
  fr: {
    translation: {
      settings: {
        title: 'Paramètres',
        general: {
          title: 'Général',
          language: 'Langue',
          sidebar: 'État par Défaut de la Barre Latérale'
        },
        theme: {
          title: 'Thème',
          mode: 'Mode de Thème',
          light: 'Clair',
          dark: 'Sombre',
          system: 'Système',
          accent: 'Couleur d\'Accent'
        },
        sidebar: {
          expanded: 'Toujours Déplié',
          collapsed: 'Toujours Replié',
          auto: 'Responsive'
        },
        colors: {
          blue: 'Bleu',
          purple: 'Violet',
          green: 'Vert',
          red: 'Rouge',
          amber: 'Ambre',
          pink: 'Rose'
        },
        advanced: {
          title: 'Avancé',
          version: 'Version',
          reset: 'Réinitialiser les Paramètres',
          resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?'
        }
      }
    }
  },
  de: {
    translation: {
      settings: {
        title: 'Einstellungen',
        general: {
          title: 'Allgemein',
          language: 'Sprache',
          sidebar: 'Standard-Seitenleistenzustand'
        },
        theme: {
          title: 'Design',
          mode: 'Design-Modus',
          light: 'Hell',
          dark: 'Dunkel',
          system: 'System',
          accent: 'Akzentfarbe'
        },
        sidebar: {
          expanded: 'Immer Erweitert',
          collapsed: 'Immer Eingeklappt',
          auto: 'Responsiv'
        },
        colors: {
          blue: 'Blau',
          purple: 'Lila',
          green: 'Grün',
          red: 'Rot',
          amber: 'Bernstein',
          pink: 'Rosa'
        },
        advanced: {
          title: 'Erweitert',
          version: 'Version',
          reset: 'Einstellungen Zurücksetzen',
          resetConfirm: 'Möchten Sie wirklich alle Einstellungen zurücksetzen?'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;