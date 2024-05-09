const obj1 = {}
const obj2 = { message : "안 빔"}
const num = 1
const str1 = "one"
const str2 = ""

console.log(Object.keys(obj1).length === 0) // length === 0
console.log(Object.keys(obj2).length === 0) // length === 1
// console.log(Object.keys(num).length === 0)
console.log(Object.keys(str1).length) // value === 3  
console.log(Object.keys(str2).length) // value === 0

// ★=> 문자열도 객체이다★


function isEmpty(obj) { 
    if(Object.keys(obj).length === 0) {
        return true; 
    } else { 
        return false; 
    }
}