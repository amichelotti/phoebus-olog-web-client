import styled from "styled-components";
import ErrorMessage from "./ErrorMessage";

const Container = styled.div`
    display: flex;
    flex-direction: ${({inlineLabel}) => inlineLabel ? 'row' : 'column'};    
    padding: 0 0.5rem;
    padding-bottom: 1rem;
    width: 100%;
    ${({inlineLabel}) => inlineLabel ? `
        align-items: center;
        gap: 0.5rem;
    ` : `
        justify-content: center;
        gap: 0.2rem;
    `}

    & label {
        white-space: nowrap;
    }

    & span {
        padding-top: 0.2rem;
    }
`

const LabeledInput = ({name, label, error, inlineLabel, className, children}) => {

    return (
        <Container {...{inlineLabel, className}}>
            <label htmlFor={name}>{label}</label>
            {children}
            <ErrorMessage error={error} />
        </Container>
    )
};

export default LabeledInput;