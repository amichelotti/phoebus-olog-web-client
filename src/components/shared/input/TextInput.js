import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components"
import LabeledInput from "./LabeledInput"

export const StyledInput = styled.input`
    width: 100%;
    padding: 0.5rem 1rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`

export const StyledTextArea = styled.textarea`
    width: 100%;
    padding: 0.5rem 1rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`

export const StyledTextInput = React.forwardRef(({name, label, className, textArea=false, rows=3, password=false, value, onChange, ...props}, innerRef) => {
    return textArea ? 
    <StyledTextArea 
        ref={innerRef}
        name={name} 
        id={name}
        placeholder={label}
        className={className}
        value={value}
        onChange={onChange}
        rows={rows}
        {...props}
    />
    : <StyledInput 
        ref={innerRef}
        type={password ? 'password' : 'text'}
        name={name} 
        id={name}
        placeholder={label}
        className={className}
        value={value}
        onChange={onChange}
        {...props}
    />;
})

export const StyledLabeledTextInput = React.forwardRef(({name, label, message, className, textArea=false, rows=3, password=false, value, onChange, inlineLabel, ...props}, innerRef) => {
    return (
        <LabeledInput {...{name, label, error: message, inlineLabel}} >
            <StyledTextInput 
                {...{
                    ref:innerRef,
                    name, label, className, textArea, rows, password, value, onChange
                }}
                {...props}
            />
        </LabeledInput>
    );
});

export const TextInput = ({name, label, control, rules, defaultValue, className, textArea=false, rows=3, password=false, inlineLabel, ...props}) => {
    
    const {field, fieldState} = useController({name, control, rules, defaultValue});

    return <StyledLabeledTextInput 
        {...{name, 
            label, 
            message: fieldState?.error?.message, 
            className, 
            textArea, 
            rows, 
            password, 
            ref: field.ref, 
            value:field.value, 
            onChange:field.onChange,
            inlineLabel,
        }}
        {...props}
    />
    
}

export default TextInput;