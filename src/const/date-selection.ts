import dayjs from "dayjs";

const currentMonth = function () {
  const start = new Date()
  const end = new Date()
  return [dayjs(start.setDate(1)).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
}
const lastMonth = function () {
  const start = new Date();
  start.setMonth(start.getMonth() - 1, 1);
  const end = new Date();
  end.setMonth(end.getMonth(), 0);
  return [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
}
const currentQuarter = function () {
  const y = new Date().getFullYear(); // 当前年份
  const m = new Date().getMonth(); // 当前月份
  const q = parseInt(String(m / 3)); // 当前季度
  const start = new Date(y, q * 3, 1); // 当前季度的开始日期
  const end = new Date();
  return [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
}
const lastQuarter = function () {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const q = parseInt(String(m / 3));
  const start = new Date(y, (q - 1) * 3, 1); // 上一季度的开始日期
  const end = new Date(y, q * 3, 0); // 上一季度的结束日期
  return [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
}
const currentYear = function () {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date();
  return [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
}
const lastYear = function () {
  const start = new Date(new Date().getFullYear() - 1, 0, 1);
  const end = new Date(new Date().getFullYear() - 1, 11, 31);
  return [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')]
};

const pickerOptions = {
  shortcuts: [
    {
      text: "本月",
      onClick(picker: any) {
        picker.$emit("pick", currentMonth());
      }
    },
    {
      text: "上月",
      onClick(picker: any) {
        picker.$emit("pick", lastMonth());
      }
    },
    {
      text: "本季度",
      onClick(picker: any) {
        picker.$emit("pick", currentQuarter());
      }
    },
    {
      text: "上季度",
      onClick(picker: any) {
        picker.$emit("pick", lastQuarter());
      }
    },
    {
      text: "今年",
      onClick(picker: any) {
        picker.$emit("pick", currentYear());
      }
    },
    {
      text: "去年",
      onClick(picker: any) {
        picker.$emit("pick", lastYear());
      }
    }
  ]
}
/** range of time */
export {
  currentMonth,
  lastMonth,
  currentQuarter,
  lastQuarter,
  currentYear,
  lastYear
}
/** element-ui date-picker */
export {
  pickerOptions
}
