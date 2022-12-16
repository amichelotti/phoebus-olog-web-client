/**
 * Copyright (C) 2021 European Spallation Source ERIC.
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
import { useState, useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
// import Tooltip from 'react-bootstrap/Tooltip';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCurrentLogEntry } from 'features/currentLogEntryReducer';
import styled from 'styled-components';
import Button from 'components/shared/Button';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`

const NavButton = styled(Button)`
    padding: 0.5rem 1rem;;
`

const NavigationButtons = ({
    currentLogEntry,
    searchResults
}) => { 

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [previousLogEntry, setPreviousLogEntry] = useState();
    const [nextLogEntry, setNextLogEntry] = useState();

    const navigateToLogEntry = (logEntry) => {
        if(logEntry) {
            dispatch(updateCurrentLogEntry(logEntry));
            navigate('/logs/' + logEntry.id);
        }
    };

    useEffect(() => {
        // Get the index of the current log entry; note findIndex returns -1 if no result
        // This should only happen when navigating to a log entry directly, without searching first
        // todo: clear search results if navigating directly
        const currentIndex = searchResults?.logs?.findIndex(item => item.id === currentLogEntry.id);
        if(currentIndex >= 0) {
            setPreviousLogEntry(searchResults.logs[currentIndex - 1]);
            setNextLogEntry(searchResults.logs[currentIndex + 1]);
        }
    }, [currentLogEntry, searchResults]);

    return (
        <Container>
            <NavButton 
                variant='primary'
                disabled={!previousLogEntry}
                onClick={() => navigateToLogEntry(previousLogEntry)}
            >
                <FaArrowLeft/>
            </NavButton>
            <NavButton 
                variant='primary'
                disabled={!nextLogEntry}
                onClick={() => navigateToLogEntry(nextLogEntry)}
            >
                <FaArrowRight/>
            </NavButton>
        </Container>
    )

}

export default NavigationButtons;

