import { useState, useEffect } from 'react';
import styles from "./payment/address.module.css"
export const AddressSearch = ({ setResponse, setTheAddress }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    let long = 0
    let lat = 0
    const extent = selectedAddress?.["details"]["extent"]
    
    if(!extent){
      setResponse(null)
      return
    }
    if (extent.length > 2) {
      long = (extent[0] + extent[2]) / 2
      lat = (extent[1] + extent[3]) / 2
    } else {
      long = extent[0]
      lat = extent[1]
    }
    
    if (
      lat >= 52.7622 &&
      lat <= 54.2122 &&
      long >= -3.4926 &&
      long <= -1.0526
    ) {
      setResponse(true)
      setTheAddress(selectedAddress)
    } else {
      setResponse(false)
    }
  }
    , [selectedAddress])
  useEffect(() => {
    const fetchAddresses = async () => {
      if (query.length < 3 || query === selectedAddress?.label || suggestions == []) {
        setSuggestions([]);
        return;
      }

      try {
        // Photon API: Free, No-Key, OpenStreetMap based
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        //Without an extent e.g. long/lat my logic breaks
        const loop = data.features.filter((f)=> {return f.properties.extent !== undefined} )
        const results = loop.map((f) => ({
          id: f.properties.osm_id,
          label: [
            f.properties.name,
            f.properties.street,
            f.properties.city,
            f.properties.postcode,
            f.properties.country
          ].filter(Boolean).join(', '),
          details: f.properties
        }));
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    // Debounce the API call to save resources
    const timeoutId = setTimeout(fetchAddresses, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (address) => {
    setSuggestions([]);
    setQuery(address.label);
    setSelectedAddress(address);
    

  };

  return (
    <div style={{position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing your address..."
        style={{

        }}
        className={styles.search}
      />

      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '0 0 8px 8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};