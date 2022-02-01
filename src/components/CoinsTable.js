import {
  Container,
  createTheme,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  LinearProgress,
  TableBody,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { numberWithCommas } from "./Banner/Carousel";

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
  }));

  const classes = useStyles();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList());
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const darkTheme = createTheme({
    palette: {
      type: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search for a Cryptocurrency"
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24hr Change", "Market Cap"].map(
                    (head) => {
                      return (
                        <TableCell
                          style={{
                            color: "black",
                            fontWeight: "700",
                            fontFamily: "Montserrat",
                          }}
                          key={head}
                          align={head === "Coin" ? "left" : "right"}
                        >
                          {head}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice(0, 30)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;

                    return (
                      <TableRow
                        key={row.name}
                        onClick={() => history.push(`/coins/${row.id}`)}
                        className={classes.row}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ display: "flex", gap: 15 }}
                        >
                          <img
                            src={row?.image}
                            alt={row?.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row?.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          $
                          {row.current_price > 1
                            ? numberWithCommas(row.current_price.toFixed(2))
                            : row.current_price.toFixed(6)}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          $
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
