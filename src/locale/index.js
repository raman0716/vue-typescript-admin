import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "@/store";
import ElementLocale from "element-ui/lib/locale";
import messages from "./lang";

Vue.use(VueI18n);

const LAN = localStorage.getItem("localeLan") || "en";
localStorage.setItem("localeLan", LAN);

export const i18n = new VueI18n({
  locale: LAN,
  fallbackLocale: "en",
  messages,
  silentTranslationWarn: true
});

// 可用于语言选择时候的菜单
export const locale = [
  {
    label: "简体中文",
    value: "cn"
  },
  {
    label: "English",
    value: "en"
  }
];

const setI18nLanguage = lang => {
  i18n.locale = lang;
  localStorage.setItem("localeLan", lang);
  return lang;
};

const loadedLanguages = [];

export async function loadLanguageAsync(lang) {
  if (!loadedLanguages.includes(lang)) {
    const msgs = await import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`);
    i18n.setLocaleMessage(lang, msgs.default);
    ElementLocale.i18n((key, value) => i18n.t(key, value));
    loadedLanguages.push(lang);
    store.commit("language/load");
    return setI18nLanguage(lang);
  }
  return Promise.resolve(setI18nLanguage(lang));
}
