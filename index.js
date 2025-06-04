// function greet(person: string, date: Date){
//     console.log(`Hello ${person}, today is ${date.toDateString()}`)
// }
// greet("User", new Date())
// function greet1(name: string){
//     console.log('Name is ', name)
// }
// greet1("User")
// function getNumber1(): number {
//     return 26;
// }
// getNumber1()
// const arr = ['User1', 'User2', 'User3']
// arr.forEach((s) => {
//     console.log(s.toUpperCase())
// })
// function printCoord(pt: {x: number, y: number}){
//     console.log("X ", pt.x);
//     console.log("Y ", pt.y)
// }
// printCoord({x: 4, y: 9})
// function printId(id: number | string){
//     if(typeof id === 'string'){
//         console.log(id.toUpperCase())
//     }
//     else{
//         console.log(id)
//     }
// }
// printId("cutm168")
function welcomeUser(x) {
    if (Array.isArray(x)) {
        console.log("Hello, " + x.join(" and "));
    }
    else {
        console.log("Welcome, " + x);
    }
}
welcomeUser("User1");
// welcomeUser(["User1", "User2", "User3"])
