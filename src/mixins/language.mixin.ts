import { loadLanguageAsync } from "@/locale";
import { Component, Vue } from "vue-property-decorator";

@Component
export class languageMixin extends Vue {
  setLocaleLanguage(lang?: string) {
    let browserLanguage = window.navigator.language;
    switch (browserLanguage) {
      case "en-US":
        browserLanguage = "en";
        break;
      default:
        browserLanguage = "cn";
    }
    lang = lang || localStorage.getItem("localeLan") || browserLanguage;
    loadLanguageAsync(lang);
  }
}
