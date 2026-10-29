import { IconSearch } from '@tabler/icons-react';
import { Select, Burger, Center, Divider, Drawer, Group, ScrollArea, Space, Autocomplete } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderSearch.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  {
    link: '/', label: "Home"
  },
  {
    link: '/about', label: "About"
  }
]

// interface tickSymbolResponse {
//   "symbol": string; 
//   "name": string; 
//   "currency": string; 
//   "exchangeFullName": string; 
//   "exchange": string;
// }

export function NavigationBar() {
  // const [opened, { toggle, close }] = useDisclosure(false);
  const [input, setInput] = useState<string | null>("");
  const [dropdown, setDropDown] = useState<string[]>([]);
  const [opened, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  /* Fetches the closest symbol according to the input */
  const getSymbols = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/tick_symbols/" + input);
      if (!response.ok) {
        throw Error("Failed to get response");
      }

      let res = await response.json();
      let stockSymbols: string[] = [];

      for (const obj of res) {
        stockSymbols.push(obj.symbol);
      }

      setDropDown(stockSymbols);

    } catch (err) {
      console.log(err);
    }
  }

  /* When clicking navigate to the next page */
  const switchToDashboard = (symbol: string | void) => {
    if (!symbol) 
      return;
    
    navigate(`/TradingView/${symbol}`);
  }

  /* useEffect to handle the search */
  useEffect(() => {
    if (input == "") return;
    const debounceTimer = setTimeout(() => { }, 500);

    getSymbols();

    return () => clearTimeout(debounceTimer);
  }, [input])

  const items = tabs.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      // onClick={)}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>

        <Group>
          <Group ml={50} gap={5} className={classes.links}>
            {items}
          </Group>
        </Group>

        <Autocomplete
          ml={600}
          size="md"
          radius="xl"
          className={classes.search}
          placeholder="Search for Stock Tickler Symbol"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          data={dropdown}
          style={{ width: 400 }}
          value={input ? input : ''}
          onChange={setInput}
          onOptionSubmit={switchToDashboard}
        />

      </div>
    </header>

  )

}