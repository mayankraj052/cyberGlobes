export async function handleSubmit(event: Event, serviceFunction: Function, successCallback: Function, errorMessages: string[], setLoading: Function) {
    event.preventDefault();
    setLoading(true);

    try {
        const data = await serviceFunction();
        if (data.success) {
            successCallback(data);
        } else {
            handleErrors(data, errorMessages);
        }
    } catch (error) {
        errorMessages.push('An unexpected error occurred.');
    } finally {
        setLoading(false);
    }
}

export function handleErrors(data: any, errorMessages: string[]) {
    errorMessages.length = 0;

    if (data.errors) {
        Object.keys(data.errors).forEach(key => {
            errorMessages.push(...data.errors[key]);
        });
    } else {
        errorMessages.push(data.message || 'An error occurred');
    }
}