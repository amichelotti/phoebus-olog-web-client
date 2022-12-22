/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import MultiSelect from 'components/shared/input/MultiSelect';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchParams } from 'features/searchParamsReducer';
import { updateSearchPageParams } from 'features/searchPageParamsReducer';
import Collapse from './Collapse';
import TextInput from 'components/shared/input/TextInput';
import WizardDateInput from 'components/shared/input/WizardDateInput';
import RadioInput from 'components/shared/input/RadioInput';
import styled from 'styled-components';
import Button from 'components/shared/Button';

const StyledCollapse = styled(Collapse)`
    height: 100%;
`

const Container = styled.div`

`

const Form = styled.form`

`

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
const Filters = ({showFilters, logbooks, tags, className}) => {

    const dispatch = useDispatch();
    const searchParams = useSelector(state => state.searchParams);
    const searchPageParams = useSelector(state => state.searchPageParams);
    const form = useForm({defaultValues: {...searchParams}});;

    const { control, handleSubmit, getValues } = form;
    
    const onSubmit = (data) => {

        const updatedSearchParams = {...data};
        delete updatedSearchParams.sort;
        const updatedSearchPageParams = {...searchPageParams, sort: data.sort}

        dispatch(updateSearchParams(updatedSearchParams));
        dispatch(updateSearchPageParams(updatedSearchPageParams));

    }

    const onSearchParamFieldValueChanged = (field, value, submit=true) => {
        field.onChange(value);
        // updateSearchParams(field.name, value, submit);
        if(submit) {
            onSubmit(getValues());
        }
    }

    const isDate = (obj) => {
        return obj instanceof Date && !isNaN(obj);
    }
    const toDate = (dateString) => {
        if(isDate(dateString)) {
            return new Date(dateString);
        } else {
            return null;
        }
    }

    return(
        <StyledCollapse show={showFilters} onExiting={handleSubmit(onSubmit)} >
            <Container style={{padding: "8px"}} className={className} >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Hidden button handles submit-on-enter automatically */}
                    <Button type='submit' hidden >Submit</Button>
                    <TextInput 
                        name='title'
                        label='Title'
                        control={control}
                        defaultValue=''
                    />
                    <TextInput 
                        name='desc'
                        label='Text'
                        control={control}
                        defaultValue=''
                    />
                    <MultiSelect 
                        name='logbooks'
                        label='Logbooks'
                        control={control}
                        defaultValue={[]}
                        options={logbooks.map(it => (
                            {label: it.name, value: it}
                        ))}
                        onSelection={(value) => value.map(it => (
                            {label: it, value: it}
                        ))}
                        onSelectionChanged={(field, value) => onSearchParamFieldValueChanged(field, value.map(it => it.label), true)}
                    />
                    <MultiSelect 
                        name='tags'
                        label='Tags'
                        control={control}
                        defaultValue={[]}
                        options={tags.map(it => (
                            {label: it.name, value: it}
                        ))}
                        onSelection={(value) => value.map(it => (
                            {label: it, value: it}
                        ))}
                        onSelectionChanged={(field, value) => onSearchParamFieldValueChanged(field, value.map(it => it.label), true)}
                    />
                    <TextInput 
                        name='owner'
                        label='Author'
                        control={control}
                        defaultValue=''
                    />
                    <WizardDateInput 
                        name='start'
                        label='Start Time'
                        form={form}
                        defaultValue={getValues('start')}
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}
                        rules={{
                            validate: {
                                timeParadox: val => {
                                    const startDate = toDate(val);
                                    const endDate = toDate(getValues('end'));
                                    if(startDate && endDate) {
                                        return startDate <= endDate || 'Start date cannot come after end date'
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        }}
                    />
                    <WizardDateInput 
                        name='end'
                        label='End Time'
                        form={form}
                        defaultValue={getValues('end')}
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}
                        rules={{
                            validate: {
                                timeParadox: val => {
                                    const startDate = toDate(getValues('start'));
                                    const endDate = toDate(val);
                                    if(startDate && endDate) {
                                        return endDate > startDate || 'End date cannot come before start date'
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        }}
                    />
                    <RadioInput 
                        name='sort'
                        label='Sort'
                        control={control}
                        defaultValue={searchPageParams.sort || ''}
                        options={[
                            {
                                label: 'Sort descending on date',
                                value: 'down'
                            },
                            {
                                label: 'Sort ascending on date',
                                value: 'up'
                            }
                        ]}
                        onChange={(field, val) => onSearchParamFieldValueChanged(field, val, true)}

                    />
                    <TextInput 
                        name='attachments'
                        label='Attachments'
                        control={control}
                        defaultValue=''
                    />
                </Form>
            </Container>
        </StyledCollapse>
    );
}

export default Filters;
