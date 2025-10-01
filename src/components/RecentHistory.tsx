import styled from "styled-components";
import useHistory from "../services/useHistory";
import AbilityResultDisplay from "./ability/AbilityResultDisplay";
import FlipMove from "react-flip-move";

const ResultsLayout = styled(FlipMove)`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  overflow: scroll;
  gap: 8px;
  padding: 8px 0;
`;

const ResultWrapper = styled.div`
  display: flex;
  align-items: stretch;
`;

const maxResults = 6;

const RecentHistory = () => {
  const { resultHistory } = useHistory();
  return (
    <ResultsLayout>
      {resultHistory
        .slice(-1 * maxResults)
        .map(({ result, timestamp, id }) => (
          <ResultWrapper key={id}>
            <AbilityResultDisplay {...result} timestamp={timestamp} />
          </ResultWrapper>
        ))
        .reverse()}
    </ResultsLayout>
  );
};

export default RecentHistory;
