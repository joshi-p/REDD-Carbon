import { useEffect, useState } from "react";

const APIKEY: string = import.meta.env.VITE_GIPHY_API;

interface UseFetchProps {
    keyword: string;
}

const useFetch = ({ keyword }: UseFetchProps): string => {
    const [gifUrl, setGifUrl] = useState<string>("");

    const fetchGifs = async () => {
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${encodeURIComponent(
                    keyword
                )}&limit=1`
            );
            const { data } = await response.json();

            setGifUrl(data[0]?.images?.downsized_medium.url || "");
        } catch (error) {
            setGifUrl(
                "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTVlbHZlaTY4ZmJ2YjRscHhpbTN6Y3ZmeWozc2Vqam90bnQwMzVybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1gIEuPk3ZvhTDoAfMJ/giphy.gif"
            );
        }
    };

    useEffect(() => {
        if (keyword) fetchGifs();
    }, [keyword]);

    return gifUrl;
};

export default useFetch;
