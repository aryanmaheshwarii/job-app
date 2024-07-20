// ye apne parameter m login ka function accept krega ...

const catchAsyncError = (Fun) => {
    return (req, res, next) => {
        Promise.resolve(Fun(req, res, next)).catch(next);
    }
}

module.exports = catchAsyncError;