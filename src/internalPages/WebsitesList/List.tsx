import React, {useState, useEffect} from 'react';
import {useAsyncEffect} from 'use-async-effect';
import styles from '../../styles/list.style';
import Record from './Record';
import { WithStyles, Typography, withStyles, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const baseurl = 'http://unstoppabledomains.com/api/v1';  
// const baseurl = 'http://localhost:8080/api/v1';
interface Props extends WithStyles<typeof styles> {

}

const List: React.FC<Props> = ({classes}) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    //Todo get last usage prefs from store and change them here
    setPage(1);
    setPerPage(20);
  }, []);

  useAsyncEffect(async () => {
    const freshdomains = await fetchDomains(page, perPage);
    setDomains(freshdomains);
  }, [page, perPage]);

  const fetchDomains = async (page, perPage) => {
    const url = `${baseurl}/websites/?page=${page}&perPage=${perPage}`;
    try {
      console.log(url);
      const domains: string[] = await fetch(url, {method: 'GET'}).then(res => res.json());
      if (!domains || !domains[0]) return [];
      return domains;
    }catch(err) {
      console.error(err);
      return [];
    }
  }

  const goBack = (e) => { if (page > 1) setPage(page - 1); }
  const goForward = (e) => setPage(page + 1);

  return (
    <div className={classes.background}>
      <div className={classes.heading}>
        <Typography variant="h3">Websites Navigation Book</Typography>
        <Typography variant="overline">There are {domains.length} records per page</Typography>
      </div>
      <div className={classes.center}>
        <Grid container spacing={2} className={classes.grid}>
          {
            domains.map(domain => <Grid item key={domain}><Record domain={domain}/></Grid>)
          }
        </Grid>
      </div>
      <div className={classes.status}>
        <ArrowBackIosIcon onClick={goBack}/>
        <Typography variant="body1">{`Page count: ${page}`}</Typography>
        <ArrowBackIosIcon onClick={goForward} className={classes.reflected}/>
      </div>
    </div>
  );
}

export default withStyles(styles)(List);