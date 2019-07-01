import { Message } from "element-ui";
// import { mapState } from 'vuex'

export default {
  mixins: [
    {
      methods: {
        showLog(msg?: string | number): void {
          console.log(msg ? String(msg) : "no log msg");
        },
        showMSg(msg?: string | number): void {
          Message.info(msg ? String(msg) : "no log msg");
        }
      }
    }
  ]
};
