import { Box, Image, Link, NextLink, Popup } from "@kleros/components";
import { graphql, useQuery } from "relay-hooks";

import { useEvidenceFile } from "data";

export default function SmallAvatar({ submissionId }) {
  const { props } = useQuery(
    graphql`
      query smallAvatarQuery($id: ID!) {
        submission(id: $id) {
          id
          status
          name
          requests(
            orderBy: creationTime
            orderDirection: desc
            first: 1
            where: { registration: true }
          ) {
            disputed
            evidence(orderBy: creationTime, first: 1) {
              URI
            }
          }
        }
      }
    `,
    { id: submissionId }
  );

  const { submission } = props || {};
  const { requests, name: _name } = submission || {};
  const request = requests?.[0];
  const evidence = useEvidenceFile()(request?.evidence?.[0]?.URI);
  const name =
    evidence instanceof Error
      ? "We are doing some maintenance work and will be online again soon."
      : evidence?.file?.name &&
        (_name.replaceAll(/[^\s\w]/g, "") ===
        evidence.file.name.replaceAll(/[^\s\w]/g, "")
          ? evidence.file.name
          : "We are doing some maintenance work and will be online again soon.");
  const variant =
    submission?.status === "None" && request?.disputed
      ? "challengedSmallAvatar"
      : "smallAvatar";
  return (
    <NextLink href="/profile/[id]" as={`/profile/${submissionId}`}>
      <Link
        sx={{
          height: 32,
          marginRight: 1,
        }}
        newTab
      >
        <Popup
          trigger={
            <Box
              sx={{
                span: { display: "flex" },
              }}
            >
              <Image variant={variant} src={evidence?.file?.photo} />
            </Box>
          }
          on={["focus", "hover"]}
          sx={{
            color: "text",
            fontSize: 1,
            textAlign: "center",
          }}
        >
          {name}
        </Popup>
      </Link>
    </NextLink>
  );
}
