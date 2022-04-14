import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';


import { UsersDisplay } from "./components/UsersDisplay";

function App()
{
  const [searchVal, setSearchVal] = useState("");
  const [userData, setUserData] = useState([]);
  const [errMess, setErrMess] = useState("")
  const [userCount, setUserCount] = useState(false);

  const getData = async (data) =>
  {
    if (data.length > 2) {
      try {
        const userResponse = await axios.post('/api/search',
          {
            type: 'users',
            text: data
          }
        );
        setUserData(userResponse.data.users);
        if (userResponse.data.users.length === 0)
          setUserCount(true);
        else
          setUserCount(false);
      }
      catch (err) {
        if (err.response.status === 429) {
          setErrMess("Rate Limit Exceeded");
          setUserData([]);
        }
      }
    }
    else {
      if (data.length !== 0)
        setErrMess("Characters must be between 3 and 39 characters");
      setUserData([]);
      setUserCount(false)
    }
  }

  const debouncedCall = useCallback(debounce(getData, 200, { trailing: true }), [])

  const updateText = async (event) =>
  {
    setSearchVal(event.target.value);
    setErrMess("");
    debouncedCall(event.target.value);
  }



  return (
    <Container maxwidth="sm">
      <Box sx={{
        m: "5rem auto", display: "flex", alignItems: "center",
        flexDirection: "column",
        // bgcolor: "lightblue"
      }}>
        <Typography variant="h2" >
          GitHub User Search
        </Typography>
        <TextField fullWidth label="" value={searchVal} onChange={updateText} />
        <Typography variant="p" color="error">
          {errMess}
        </Typography>
        {userCount &&
          <Typography variant="h5" >
            No Users Found
          </Typography>
        }
      </Box>
      <Box>
        <UsersDisplay userData={userData} />
      </Box>
    </Container >
  );
}

export default App;
