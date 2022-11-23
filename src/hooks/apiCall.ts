import { useCallback, useEffect, useRef, useState } from "react"
import axios, { AxiosResponse } from 'axios';

interface Props<T> {
    url: string;
    preFetch?: boolean;
    callback?: (res: AxiosResponse) => T;
}

export const useFetch = <T = any>({
    url,
    callback,
    preFetch = true,
}: Props<T>) => {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(preFetch);

    const fetchCall = useCallback(():Promise<AxiosResponse> => {
        setLoading(true);

        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);

                setData(!!callback ? callback(res) : res.data);

                resolve(res);
            }
            catch (error) {

                setError(error);
                setLoading(false);

                reject(error);
            }
        })
        
    }, [url, callback]);

    useEffect(() => {
        if (preFetch) {
            fetchCall();
        }
    }, [preFetch, fetchCall]);

    return {
        data,
        loading,
        error,
        fetch: fetchCall,
    }
}
