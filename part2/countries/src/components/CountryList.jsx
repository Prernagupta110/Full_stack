import React from 'react';

const CountryList = ({countries, onCountryClick, onDetailsClick}) => {
    return (
        <ul>
            {countries.map((country) => (
                <li key={country.cca3} onClick={() => onCountryClick(country.cca3)}>
                    {country.name.common}
                    <button onClick={() => onDetailsClick(country.cca3)}>show</button>
                </li>
            ))}
        </ul>
    );
};

export default CountryList;