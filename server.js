const express = require('express');
const MyError = require('./error')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes/views start here


//route code starts
let operations = ['mean', 'median', 'mode'];

app.get('/:operation', function(req, res, next) {
    try{
    let operation = req.params.operation;
    if (!operations.includes(operation)){
        // return res.status(404).json('Whoops! Nothing here!');
        throw new MyError('Invalid operation name. Use mean, median, or mode.', 400)
    }
    let nums = req.query['nums'];
    if(!nums){
        throw new MyError('Please includes some numbers to calculate.', 400)
    }
    let myNums = convertQueryToNums(nums);
    if(myNums === 'error'){
        throw new MyError('Type Error. Please only pass in numbers to calculate.', 400)
    }
    let value = calculate(operation, myNums);
    return res.json({ operation: req.params.operation, value : value});
    } catch (e){
        next(e);
    }
});

//Routes/views end here

//math functions
const mean = array => {
    let sum = 0;
    for(let num in array){
        sum += array[num];
    }
    return sum/array.length;
}

const median = array => {
    array.sort((a, b) => a - b);
    let length = array.length;
    let idx;
    if(isEven(length)){
        idx = ((length/2) - 1);
    } else{
        idx = (Math.floor(length/2));
    }
    let med = array[idx]
    return med;
}

function isEven(num){
    if(num%2 === 0){
        return true;
    }
    return false;
}

const mode = array => {
    let mostCount = -1;
    let mostNum= -1;
    let obj = {};
    for(let num in array){
        if (!obj[array[num]]){
            obj[array[num]]=1;
        } else{
            obj[array[num]]+=1;
        }
    }
    let objKeys = Object.keys(obj);
    objKeys.forEach(key=> {
        let value = obj[key];
        if(value > mostCount){
            mostCount = value;
            mostNum = key;
        }
    })
    return +mostNum;
}

function calculate (operation, array){
    if (operation === 'mean'){
        return mean(array);
    } else if (operation === 'median'){
        return median(array);
    } else{
        return mode(array);
    }
}

const convertQueryToNums = (data) => {
    let numArray = data.split(",");
    let myNums=[];
    for (let num in numArray){
        let newNum = parseInt(numArray[num]);
        if (isNaN(newNum)){
            return 'error';
        }
        myNums.push(newNum);
    }
    return myNums;
}

module.exports = { mean, median, mode };
//end math functions




//404 handler- needs to come after routes but before error handler below
app.use((req,res,next)=>{
    const e = new MyError('Page not found', 404);
    next(e);
})
//end 404 handler

//error handler goes here just above app.listen
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.msg;
    return res.status(status).json({
            error: {message, status}
        });
    });
//end error handler

//This app.listen should be at the bottom of the file
app.listen(3000, () => console.log('Server running on port 3000'))

