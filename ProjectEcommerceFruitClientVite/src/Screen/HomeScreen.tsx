import { observer } from "mobx-react-lite";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import Loading from "../layout/component/LoadingComponent";

export default observer(function HomeScreen() {
  const navigate = useNavigate();

  const { product, getProduct, category, getCategory } =
    useStore().productStore;

  useEffect(() => {
    getProduct(0);
    getCategory();
  }, []);

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  const onSelectCate = (categoryId: number) => {
    getProduct(categoryId);
  };

  const NavigateDetail = (product: any) => {
    navigate(RoutePath.productDetail(product.id));
  };

  useEffect(() => {
    getProduct(0);
    getCategory();
  }, [getProduct, getCategory]);

  if (!Array.isArray(product) || !Array.isArray(category)) {
    return <Loading />;
  }

  return (
    <>
      <Container maxWidth="xl">
        <Section>
          <FilterSection>
            <FormControl fullWidth>
              <InputLabel>ประเภท</InputLabel>
              <Select defaultValue="0" label="ประเภท">
                {categories.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                    onClick={() => onSelectCate(item.id)}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              <StyledFormControlLabel control={<Checkbox />} label="In Stock" />
              <StyledFormControlLabel control={<Checkbox />} label="On Sale" />
            </FormGroup>

            <TypographySection>Price</TypographySection>
            <FormGroup>
              <StyledFormControlLabel control={<Checkbox />} label="50 - 100" />
              <StyledFormControlLabel
                control={<Checkbox />}
                label="100 - 150"
              />
              <StyledFormControlLabel
                control={<Checkbox />}
                label="150 - 200"
              />
              <StyledFormControlLabel
                control={<Checkbox />}
                label="200 - 250"
              />
            </FormGroup>
          </FilterSection>
          <ContentSection>
            <Typography variant="h4" gutterBottom align="left">
              สินค้าจำนวน ({product.length}) ชิ้น
            </Typography>
            <Grid container spacing={4} justifyContent="left">
              {product.map((product, i) => (
                <Grid item key={i} xs={12} sm={6} md={4}>
                  <StyledCard>
                    <a
                      onClick={() => NavigateDetail(product)}
                      style={{ textDecoration: "none" }}
                    >
                      <StyledCardMedia
                        component="img"
                        alt={product.productGI.name}
                        // image={products[i % 3].imageUrl}
                        image={pathImages.product + product.images}
                      />
                    </a>
                    <StyledCardContent>
                      <ProductTitle variant="h6" component="div">
                        {product.productGI.name}
                      </ProductTitle>
                      <ProductDescription variant="body2">
                        ฿ {product.price}
                      </ProductDescription>
                      <ButtonWrapper onClick={() => NavigateDetail(product)}>
                        <FullWidthButton variant="outlined">
                          เยี่ยมชมสินค้า
                        </FullWidthButton>
                      </ButtonWrapper>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </ContentSection>
        </Section>
      </Container>
    </>
  );
});

// Custom styled components

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontWeight: 800,
}));

const StyledCard: any = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  boxShadow: theme.shadows[8],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[15],
  },
  height: "350px",
  maxWidth: "300px",
}));

const StyledCardMedia: any = styled(CardMedia)(() => ({
  height: 200,
  borderRadius: "12px 12px 0 0",
  objectFit: "cover",
}));

const StyledCardContent: any = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  textAlign: "left",
  padding: theme.spacing(2),
  flexGrow: 1,
}));

const ProductTitle: any = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));

const ProductDescription: any = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const Section: any = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
  display: "flex",
}));

const FilterSection: any = styled(Box)(({ theme }) => ({
  width: "250px",
  padding: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
  marginRight: "20px",
}));

const ContentSection: any = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const ButtonWrapper: any = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: "center",
  display: "flex",
}));

const FullWidthButton: any = styled(Button)(({ theme }) => ({
  width: "100%",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
}));

const TypographySection: any = styled(Box)(() => ({
  fontSize: 22,
  fontWeight: 600,
  marginTop: 20,
}));

const TypographySectiontop: any = styled(Box)(() => ({
  fontSize: 22,
  fontWeight: 600,
}));
