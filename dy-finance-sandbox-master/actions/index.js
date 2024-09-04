export const updateSettings = (data) => {
    return {
        type: 'UPDATE',
        payload: data
    }
}

export const authorize = (data) => {
    return {
        type: 'AUTH',
        payload: data
    }
}
