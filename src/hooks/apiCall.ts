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
    const [loading, setLoading] = useState(preFetch);

    const fetchCall = useCallback(()=> {
        setLoading(true);
        
        axios.get(url).then(res => {
                
            setData(!!callback ? callback(res) : res.data);

        }).finally(()=> {
            setLoading(false);
        });
    }, [url, callback]);

    useEffect(() => {
        if (preFetch) {
            fetchCall();
        }
    }, [preFetch, fetchCall]);

    return {
        data,
        loading,
        fetch: fetchCall,
    }
}
