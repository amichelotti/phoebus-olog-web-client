/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import { useEffect, useMemo } from 'react';
import { Remarkable } from 'remarkable';
import imageProcessor from 'utils/image-processor';
import customization from 'utils/customization';
import {getLogEntryGroupId} from 'utils';
import LogEntryGroupView from './LogEntryGroupView';
import LogEntrySingleView from './LogEntrySingleView';
import {Link, useHref, useLocation} from "react-router-dom";
import NavigationButtons from './NavigationButtons';
import Button, { ToggleButton } from 'components/shared/Button';
import styled from 'styled-components';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
`

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.25rem 1rem;
    border-bottom: 1px solid ${({theme}) => theme.colors.light};

    & .end {
        margin-left: auto;
    }
`

const LogViewContainer = styled.div`
    overflow: hidden;
`

const StyledLogEntrySingleView = styled(LogEntrySingleView)`
    overflow: auto;
`
const StyledLogEntryGroupView = styled(LogEntryGroupView)`
    overflow: auto;
`

/**
 * A view show all details of a log entry. Images are renderd, if such are
 * present. Other types of attachments are rendered as links.
 */
// class LogDetails extends Component{
const LogDetails = ({
    showGroup, setShowGroup, 
    currentLogEntry,
    logGroupRecords, setLogGroupRecords, 
    userData, 
    setReplyAction,
    searchResults,
    className
}) => {

    const remarkable = useMemo(() => new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        // Enable some language-neutral replacements + quotes beautification
        typographer:  false,
    }), []);

    useEffect(() => {
        remarkable.use(imageProcessor, {urlPrefix: customization.urlPrefix});
    }, [remarkable]);

    const renderedReplyButton = customization.log_entry_groups_support ?
        <Link to="/edit">
            <Button variant='primary'
                    disabled={!userData || !userData.userName}
                    onClick={() => setReplyAction(true)}>
                Reply
            </Button>
        </Link> : null;

    const currentPath = useHref(useLocation());

    const copyUrl = () => {
        navigator.clipboard.writeText(
            window.location.origin + currentPath
        )
    }

    const renderedShowGroupButton = getLogEntryGroupId(currentLogEntry.properties) ? 
        <ToggleButton variant='primary'
            checked={showGroup}
            onChange={() => setShowGroup(!showGroup)}
        >
            Show/hide group
        </ToggleButton> : null;

    const renderedLogView = showGroup 
    ? <StyledLogEntryGroupView {...{
            showGroup, setShowGroup, 
            currentLogEntry,
            userData, 
            setReplyAction, 
            logGroupRecords, setLogGroupRecords, 
            remarkable
        }}/> 
    : <StyledLogEntrySingleView currentLogEntry={currentLogEntry} remarkable={remarkable}/>;

    return(
        <Container className={className} id='logdetails-and-buttons'>
            <ButtonContainer>
                <NavigationButtons {...{
                    currentLogEntry,
                    searchResults
                }}/>
                {renderedReplyButton}
                {renderedShowGroupButton}
                <Button variant='primary' onClick={copyUrl} className='end'>Copy URL</Button>
            </ButtonContainer>
            <LogViewContainer id='logdetails'>
                {renderedLogView}
            </LogViewContainer>
        </Container>
    )
    
}

export default LogDetails;