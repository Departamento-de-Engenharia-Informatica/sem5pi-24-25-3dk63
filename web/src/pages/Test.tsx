
import  { useEffect, useState } from 'react';

interface Patient {
    firstName: string;
    id:string;
    gender:string;
    // Adicione outras propriedades aqui, se houver
}

function Test() {
    const [data, setData] = useState<Patient[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:5001/api/users', {
                    method: 'GET'
                });
                const result = await response.json();

                console.log(result);

                setData(result);
            } catch (error) {
                console.error('Erro ao obter dados:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div>
                {data ? (
                    data.map((item, index) => (
                        <div key={index}>{item.firstName} + {item.id} + {item.gender}</div>
                    ))
                ) : (
                    <p>A carregar...</p>
                )}
            </div>
        </>
    );
}

export default Test;