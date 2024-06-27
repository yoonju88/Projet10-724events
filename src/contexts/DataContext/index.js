import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null)
  const getData = useCallback(async () => {
    try {  
      const fetchedData = await api.loadData();   
      setData(fetchedData);
    } catch (err) {
      setError(err);
    }
  }, [setData, setError]);

  useEffect(() => {
    if (data)return;
    getData();   
  },[data, getData]);

  useEffect (() => {
    if (data && data.events && data.focus){
      const latestEvent = data.events.reduce((a,b) => (
        new Date(b.date) > new Date(a.date) ? b : a
      ), data.events[0]);

      const latestFocus = data.focus.reduce((a,b) => (
        new Date(b.date) > new Date(a.date) ? b : a
      ), data.focus[0]);

      if (latestEvent && latestFocus ) {
        const latestDateEvent = new Date(latestEvent.date)
        const latestDateFocus = new Date(latestFocus.date)
          if (latestDateEvent > latestDateFocus ) {
            setLast(latestEvent)
          } else if (latestDateEvent < latestDateFocus) {
            setLast(latestFocus)
          }
      }
    }
    
  }, [data])

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
