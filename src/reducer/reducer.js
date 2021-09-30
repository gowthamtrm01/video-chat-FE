const reducer = ( state , action) => {
    switch (action.type) {
        case "SENDER":
            return [...state, action.payload];
        case "RECIVER":
            return [...state, action.payload];
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

export default reducer;