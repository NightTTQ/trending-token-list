/**
 * 格式化价格
 * 要求：
 * 1. 价格至多拥有5位小数
 * 2. 如果价格超过1000，则单位变为K，超过1000000，则单位变为M，以此类推
 * 3. 如果保留5位小数时，末尾为0，则可以将末尾的0省去
 * 4. 如果价格太小，以至于小数点后到第一位有效数字之间有大于等于3个零，则使用0.{x}来表示
 */
export const formatPrice = (price: number) => {
  if (price === 0) return "$0.00";

  const units = ["", "K", "M", "B", "T"];
  let value = Math.abs(price);
  let unitIndex = 0;

  // 处理大于等于1000的情况，转换为K/M/B等单位
  while (value >= 1000 && unitIndex < units.length - 1) {
    value = value / 1000;
    unitIndex++;
  }

  const unit = units[unitIndex];
  const isNegative = price < 0;
  const sign = isNegative ? "-" : "";

  // 如果转换后的值小于1，需要检查是否需要使用0.{x}格式
  if (value < 1) {
    // 如果使用科学计数法，先转换为普通小数形式
    const decimalStr = value.toFixed(20); // 使用足够多的小数位来检测
    
    // 找到第一个非零数字的位置
    let firstNonZeroIndex = -1;
    for (let i = 0; i < decimalStr.length; i++) {
      if (decimalStr[i] !== "0" && decimalStr[i] !== ".") {
        firstNonZeroIndex = i;
        break;
      }
    }

    if (firstNonZeroIndex > 0) {
      // 计算小数点后到第一位有效数字之间的零的个数
      const zerosAfterDecimal = firstNonZeroIndex - 2; // 减去"0."两个字符
      
      if (zerosAfterDecimal >= 3) {
        // 使用0.{x}格式
        // 需要提取有效数字部分，最多5位有效数字（包括{x}中的x）
        // {x}视为一位有效数字，所以还需要4位有效数字
        
        // 提取从第一个非零数字开始的数字
        const significantDigits = decimalStr.substring(firstNonZeroIndex);
        
        // 计算需要显示的有效数字位数（不包括{x}中的x）
        // 最多5位有效数字，{x}占1位，所以剩余4位
        const maxDigits = 4;
        let digitsToShow = significantDigits.substring(0, maxDigits);
        
        // 去掉末尾的0
        digitsToShow = digitsToShow.replace(/0+$/, "");
        
        // 如果digitsToShow为空，说明都是0，至少保留一位
        if (digitsToShow === "") {
          digitsToShow = significantDigits[0] || "0";
        }
        
        return `$${sign}0.{${zerosAfterDecimal}}${digitsToShow}${unit}`;
      }
    }
    
    // 不需要使用0.{x}格式，直接格式化，最多5位小数，去掉末尾0
    let formatted = value.toFixed(5);
    // 去掉末尾的0
    formatted = formatted.replace(/\.?0+$/, "");
    return `$${sign}${formatted}${unit}`;
  }

  // 值 >= 1 的情况，最多5位小数，去掉末尾0
  let formatted = value.toFixed(5);
  // 去掉末尾的0和小数点（如果所有小数都是0）
  formatted = formatted.replace(/\.?0+$/, "");
  return `$${sign}${formatted}${unit}`;
};

/**
 * 格式化百分比变化
 */
export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * 格式化数字为缩写形式
 */
export const formatNumber = (value: number) => {
  const unit = ["", "K", "M", "B"];
  let index = 0;
  while (Math.abs(value) > 1000 && index < unit.length - 1) {
    value = value / 1000;
    index++;
  }
  return `${value.toFixed(2)}${unit[index] || ""}`;
};

/**
 * 获取变化的颜色
 */
export const getChangeColorClass = (value: number) => {
  if (value > 0) {
    return "text-green-500";
  } else if (value < 0) {
    return "text-red-500";
  }
  return "text-gray-400";
};

/**
 * 将秒转换为时间字符串
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  }

  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)}h`;
  }

  return `${Math.round(seconds / 86400)}d`;
}
