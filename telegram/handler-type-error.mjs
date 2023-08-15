
export default class HandlerTypeError extends TypeError {
    constructor() {
        const message = 'The handler should be a function!';
        super(message);
    }
}