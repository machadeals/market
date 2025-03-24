import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const burl = process.env.REACT_APP_BACKURL;

const AffiliateRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAffiliateLink = async () => {
      try {
        const response = await axios.get(`${burl}/products/${id}`);
        if (response.data && response.data.affiliateLink) {
          window.location.href = response.data.affiliateLink;
        } else {
          alert("Affiliate link not found!");
          navigate("/products");
        }
      } catch (error) {
        alert("Error fetching affiliate link");
        navigate("/products");
      }
    };

    fetchAffiliateLink();
  }, [id, navigate]);

  return <div>Redirecting to the affiliate site...</div>;
};

export default AffiliateRedirect;
