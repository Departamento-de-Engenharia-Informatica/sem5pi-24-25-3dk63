import React, { useState, useEffect } from 'react';

interface Claim {
    Type: string;
    Value: string;
}

const ClaimsViewer: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Função para buscar as claims
        const fetchClaims = async () => {
            try {
                const response = await fetch('/api/claims', {
                    method: 'GET',
                    credentials: 'include' // Inclui cookies na requisição
                });

                if (!response.ok) {
                    throw new Error('Erro ao obter as claims.');
                }

                const data: Claim[] = await response.json();
                setClaims(data);
            } catch (err) {
                setError('Erro ao obter as claims.');
                console.error('Erro:', err);
            }
        };

        fetchClaims();
    }, []);

    return (
        <div>
            <h2>Dados do Usuário</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {claims.length === 0 && !error && <p>Carregando claims...</p>}
            {claims.length > 0 && (
                <ul>
                    {claims.map((claim, index) => (
                        <li key={index}>
                            <strong>{claim.Type}</strong>: {claim.Value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClaimsViewer;
