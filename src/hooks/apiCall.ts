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
        axios.get(url).then(res => {
                
            setData(!!callback ? callback(res) : res.data);

        }).finally(()=> {
            setLoading(false);
        });
    }, [url, callback]);

    useEffectOnce(()=> {
        if (preFetch) {
            fetchCall();
        }
    });

    return {
        data,
        loading,
        fetch: fetchCall,
    }
}

export default function useEffectOnce(fn: () => void) {
    const ref = useRef(false);
    useEffect(() => {
      if (ref.current) {
        fn();
      }
      return () => {
        ref.current = true;
      };
    }, [fn]);
  }
