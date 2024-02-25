// This is a code snippet on how one dropdown can interact with another dropdown using material ui library with React18 and TypeScript. 
// Note that state is managed through the locationmatch parent component passing in selected regions based on country, 
// and clearing the regionField when the selected country is cleared.
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Autocomplete,
  TextField,
  CircularProgress
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { getCall } from "../../apiClient";
import { FirstDropdownModel } from "../../model/Countries";
import { SeconddDropdownModel } from "../../model/Regions";
import "./LocationMatch.css";

export interface LocationMatchProps {
  request: RequestResponse;
}

const LocationMatch: React.FC<LocationMatchProps> = ({ request }) => {
  //#region State Variables
  const [loading, setLoading] = useState<boolean>(true);
  const [countries, setCountries] = useState<FirstDropdownModel[]>(
    []
  );
  const [regions, setRegions] = useState<SeconddDropdownModel[]>([]);
  const [selectedRegionsOfCountry, setSelectedRegions] = useState<
    SeconddDropdownModel[]
  >([]);
  const [countryId, setCountryId] = useState<string>("");
  const [regionId, setRegionId] = useState<string | null>(null);
  const [regionField, setRegionField] = useState<{
    id: string;
    value: string;
  } | null>(null);

  //#endregion

  //#region Component Functions
  const fetchCountries = useCallback(async () => {
    const countriesResponse = await getCall("/v1/countries");
    const hsdata = JSON.parse(countriesResponse) as FirstDropdownModel[];
    setCountries(hsdata);
    setLoading(false);
  }, []);

  const fetchRegionsData = useCallback(async () => {
    const regionsResponse = await getCall("/v1/regions");
    const parsedRegions = JSON.parse(
      regionsResponse
    ) as SeconddDropdownModel[];
    setRegions(parsedRegions);
  }, []);

  useEffect(() => {
    try {
      fetchCountries();
      fetchRegionsData();
    } catch (error) {
      setLoading(false);
    }
  }, [fetchCountries, fetchRegionsData]);

  const handleCountryChange = useCallback(
    (value: string) => {
      setCountryId(value);
      setRegionField(null);
      if (value) { //whenever the country value is updated, then filter the second dropdown to just those regions of that country
        const selectedLocations = regions.filter(
          (obj) => obj.countryId === value
        );
        setSelectedRegions([...selectedLocations]);
      } else {
        setRegionId(""); //If country is cleared, set region stuff to blank.
        setSelectedRegions([]);
      }
    },
    [regions]
  );

  const handleRegionsChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: { id: string; value: string } | null
  ) => {
    if (newValue != null) {
      setRegionId(newValue!.id);
      setRegionField(newValue);
    } else {
      setRegionId("");
      setRegionField(null);
    }
  };

  const handleMatchButton = () => {
    alert(
      "Submitting a match! for countryId " +
        countryId +
        " Region " +
        regionId +
        "for request with request id" +
        request.id
    );
  };

  return (
    <Grid>
      <Card className="location-match-card">
        <CardContent>
          <Typography variant="h5" color="#333">
            Match Location
          </Typography>
          {loading && <CircularProgress></CircularProgress>}
          {!loading && (
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <AutoCompleteTextField
                  placeholderText="Search Countries"
                  aria-description="Search Countries"
                  options={countries?.map((country) => ({
                    value: country.name,
                    id: country.id,
                  }))}
                  onChange={handleCountryChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  value={regionField}
                  id="SearchRegions"
                  onChange={handleRegionsChange}
                  options={selectedRegionsOfCountry?.map((selectedRegion) => ({
                    value: selectedRegion.externalId,
                    id: selectedRegion.id,
                  }))}
                  getOptionLabel={(option) => option.value}
                  renderInput={(params) => (
                    <TextField
                      name="AutoCompleteTextField"
                      {...params}
                      label="Search Regions"
                      variant="standard"
                      size="small"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMatchButton}
                >
                  Match
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LocationMatch;
