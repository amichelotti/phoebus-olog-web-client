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
import React, {useState} from 'react';
import Logbooks from '../Logbooks/Logbooks';
import Tags from '../Tags/Tags';
import { FaCalendarAlt } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import {dateToString} from '../../utils/utils';
import Form from 'react-bootstrap/Form';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import { InputGroup } from 'react-bootstrap';

/**
 * Component holding search criteria elements, i.e.
 * logbooks, tags and time range.
 */
const Filters = ({logbooks, tags, searchParams, setSearchParams, searchPageParams, setSearchPageParams, submitSearchParams}) => {

    const [startDate, _setStartDate] = useState(new Date()); // Used by calendar component
    const [endDate, _setEndDate] = useState(new Date()); // Used by calendar component
    const [showSelectStartTime, setShowSelectStartTime] = useState(false);
    const [showSelectEndTime, setShowSelectEndTime] = useState(false);
    const [triggerSubmit, setTriggerSubmit] = useState(false); 

    // Instead of triggering submit of search parameters directly from a field change
    // function as a side effect (bad practice, which ofc generates warnings), instead
    // set the triggerSubmit state to true and then submit the search parameters from useEffect.
    useEffect(() => {
        if(triggerSubmit) {
            setTriggerSubmit(false);
            submitSearchParams();
        }
        // eslint-disable-next-line
    }, [triggerSubmit]);

    const setStartDate = (value) => {
        let start = dateToString(value);
        setSearchParams({...searchParams, start});
        _setStartDate(value); // This is for the calendar component only
    }

    const setEndDate = (value) => {
        let end = dateToString(value);
        setSearchParams({...searchParams, end})
        _setEndDate(value); // This is for the calendar component only
    }

    const applyAndClose = () => {
        setShowSelectStartTime(false);
        setShowSelectEndTime(false);
        submitSearchParams();
    }

    const inputChanged = (event, key) => {
        let copy = {...searchParams};
        let text = event.target.value;
        if(text !== '') {
            copy[key] = text;
        } else {
            delete copy[key];
        }
        setSearchParams(copy);
    }

    const inputChangedArray = (arr, key) => {
        let copy = {...searchParams}
        if(arr && arr.length > 0) {
            copy[key] = arr;
        } else {
            delete copy[key];
        }
        setSearchParams(copy);
        setTriggerSubmit(true);
    }

    const updateSort = (sort) => {
        setSearchPageParams({...searchPageParams, sort})
        setTriggerSubmit(true);
    }

    const onKeyDown = (e) => {
        if(e.key === 'Enter') {
            setTriggerSubmit(true);
        }
    }
    
    return(
        <>
        <Container className="grid-item filters full-height" style={{padding: "8px"}} onKeyDown={onKeyDown} >
            <Form.Group controlId='title'>
                <Form.Label>Title:</Form.Label>
                <Form.Control size="sm"
                    type="text"
                    value={searchParams['title'] || ''}
                    onChange={(e) => inputChanged(e, 'title')}
                />
            </Form.Group>
            <Form.Group controlId='text'>
                <Form.Label>Text</Form.Label>
                <Form.Control size="sm"
                    type="text"
                    value={searchParams['desc'] || ''}
                    onChange={(e) => inputChanged(e, 'desc')}
                />
            </Form.Group>
            <Form.Group controlId='logbooks'>
                <Form.Label>Logbooks</Form.Label>
                <Logbooks
                    logbooks={logbooks}
                    searchParams={searchParams}
                    updateLogbookSearchCriteria={logbooks => {inputChangedArray(logbooks, 'logbooks')}}
                />
            </Form.Group>
            <Form.Group controlId='tags'>
                <Form.Label>Tags</Form.Label>
                <Tags tags={tags}
                    searchParams={searchParams}
                    updateTagSearchCriteria={tags => {inputChangedArray(tags, 'tags')}}
                />
            </Form.Group>
            <Form.Group controlId='author'>
                <Form.Label>Author</Form.Label>
                <Form.Control size="sm"
                    type="text"
                    value={searchParams['owner'] || ''}
                    onChange={(e) => inputChanged(e, 'owner')}
                />
            </Form.Group>
            <Form.Group controlId='startTime'>
                <Form.Label>Start Time</Form.Label>
                <InputGroup>
                    <Form.Control size="sm"
                        type="text"
                        value={searchParams['start'] || ''}
                        onChange={(e) => inputChanged(e, 'start')}
                    />
                    <InputGroup.Append>
                        <Button size="sm" onClick={() => setShowSelectStartTime(true)}><FaCalendarAlt/></Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="endTime">
                <Form.Label>End Time</Form.Label>
                <InputGroup>
                    <Form.Control size="sm"
                        type="text"
                        value={searchParams['end'] || ''}
                        onChange={(e) => inputChanged(e, 'end')}
                    />
                    <InputGroup.Append>
                        <Button size="sm" onClick={() => setShowSelectEndTime(true)}><FaCalendarAlt/></Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Check style={{paddingTop: "5px"}}
                    type='radio'
                    id='sortDescending'
                    checked={searchPageParams.sort === 'down'}
                    label='Sort descending on date'
                    onChange={(e) => updateSort("down")}
                />
                <Form.Check 
                    type='radio'
                    id='sortAscending'
                    label='Sort ascending on date'
                    checked={searchPageParams.sort === 'up'}
                    onChange={(e) => updateSort("up")}
                />
            </Form.Group>
            <Form.Group controlId='attachments'>
                <Form.Label>Attachments</Form.Label>
                <Form.Control size="sm"
                    type="text"
                    value={searchParams['attachments'] || ''}
                    onChange={(e) => inputChanged(e, 'attachments')}
                />
            </Form.Group>
        </Container>
        {
        <Modal show={showSelectStartTime} onHide={() => setShowSelectStartTime(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Select Start Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <DateTimePicker
                onChange={(value) => setStartDate(value)}
                style={{width:30}}
                value={startDate}
                format='y-MM-dd HH:mm'
                clearIcon=""
                disableClock 
            />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" type="submit" onClick={() => applyAndClose()}>
                    Apply
            </Button>
            <Button variant="secondary" type="button" onClick={() => setShowSelectStartTime(false)}>
                    Cancel
            </Button>
            </Modal.Footer>
        </Modal>
        }
        {
        <Modal show={showSelectEndTime}
                onHide={() => showSelectEndTime(false)}
            >
            <Modal.Header closeButton>
                <Modal.Title>Select End Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DateTimePicker
                onChange={(value) => setEndDate(value)}
                value={endDate}
                format='y-MM-dd HH:mm'
                clearIcon=""
                disableClock></DateTimePicker>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={() => applyAndClose()}>
                        Apply
                </Button>
                <Button variant="secondary" type="button" onClick={() => setShowSelectEndTime(false)}>
                        Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        }
        </>
    );
}

export default Filters;
