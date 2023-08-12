import { gql } from "@apollo/client";

export const FETCH_ATTESTATIONS = gql`
  {
    attestations(
      where: {
        schemaId: {
          equals: "0x5ca44d342eee9fc01c3ac33547ed8ee17577db6a13dfae811906ae640412f265"
        }
        attester: { equals: "0x001B65c523b09A8057cE828bABDfa0a2d67De99C" }
        recipient: { equals: "0x7fc27e349A0049E4f8CD555c6d002fd895AfC843" }
      }
      orderBy: { recipient: desc }
    ) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
    }
  }
`;
