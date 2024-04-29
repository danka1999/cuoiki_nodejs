import { orderContant } from "./contant";
export const isJsonString = (data) => {
    try {
        JSON.parse(data)
        
    } catch (error) {
        return false
    }
    return true
}

export const getBase64 = (file) =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error)
})

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let result = []
  if (arr){
    result = arr?.map((opt) => {
      return {
        value: opt,
        label: opt
      }
    })
  }
  result.push({
    label: 'Thêm type',
    value: 'add_type'
  })
  return result
}

export const convertPrice = (price) => {
  try {
      const result  = price?.toLocaleString().replaceAll(',', '.')
      return `${result} đ`
  } catch (error) {
      return null
  }
}


export const convertDataChart = (data, type) => {
  try {
      const object = {}
      Array.isArray(data) && data.forEach((opt) => {
          if(!object[opt[type]]) {
              object[opt[type]] = 1
          } else {
              object[opt[type]]+=1
              console.log('c;getBase64', object[opt[type]], typeof(object[opt[type]]))
          }
      })
      const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
          return {
              name: orderContant.payment[item],
              value: object[item]
          }
      })
      return results
  }catch(e) {
      return []
  }
}