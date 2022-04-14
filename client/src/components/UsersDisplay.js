import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar';

function UsersDisplay({ userData })
{
    return (
        <Grid container direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
        >
            {userData.map(user =>
            {
                return (

                    <Grid item xs={12} sm={6} md={3} key={user.id}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={
                                    <Avatar alt={user.username} src={user.avatar_url}
                                    />
                                }
                                title={
                                    <Link variant="h5" color="inherit" underline="none" href={user.profile_url} target="_blank">
                                        {user.username}
                                    </Link>
                                }

                            />
                            {/* <CardActions>
                                <Button size="small" href={user.profile_url} target="_blank">See Profile</Button>
                            </CardActions> */}
                        </Card>
                    </Grid>
                )
            })

            }
        </Grid>
    );
}

export { UsersDisplay };