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
import React from 'react';
import customization from 'utils/customization';
import {getLogEntryGroupId} from 'utils';
import LogEntryGroupView from './LogEntryGroupView';
import LogEntrySingleView from './LogEntrySingleView';
import {Link, useHref, useLocation} from "react-router-dom";
import NavigationButtons from './NavigationButtons';
import styled from 'styled-components';
import { Button, Divider, Stack } from '@mui/material';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
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
const LogDetails = ({
    showGroup, setShowGroup, 
    currentLogEntry,
    logGroupRecords, setLogGroupRecords, 
    userData, 
    setReplyAction,
    searchResults,
    className
}) => {

    const renderedReplyButton = customization.log_entry_groups_support ?
        <Link to="/edit">
            <Button 
                variant="contained"
                disabled={!userData || !userData.userName}
                onClick={() => setReplyAction(true)}
                sx={{height: "100%"}}
            >
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
        <Button 
            variant="contained"
            onClick={() => setShowGroup(!showGroup)}
        >
            {showGroup ? "Hide" : "Show"} Group
        </Button> : null;

    const renderedLogView = showGroup 
    ?   <StyledLogEntryGroupView {...{
            showGroup, setShowGroup, 
            currentLogEntry,
            userData, 
            setReplyAction, 
            logGroupRecords, setLogGroupRecords, 
        }}/> 
    :   <StyledLogEntrySingleView 
            currentLogEntry={currentLogEntry} 
        />;

    return(
        <Container className={className} id='logdetails-and-buttons'>
            <Stack flexDirection="row" gap={1} borderBottom={0} padding={1} flexWrap="wrap">
                <NavigationButtons {...{
                    currentLogEntry,
                    searchResults,
                }} order={0}/>
                <Stack flexDirection="row" gap={1} order={2} sx={{flexBasis: ["100%", "auto"]}}>
                    {renderedReplyButton}
                    {renderedShowGroupButton}
                </Stack>
                <Button 
                    variant="contained" 
                    onClick={copyUrl} 
                    sx={{
                        marginLeft: "auto",
                        order: [0, 3]
                    }}
                >
                    Copy URL
                </Button>
            </Stack>
            <Divider />
            <LogViewContainer id='logdetails'>
                {renderedLogView}
            </LogViewContainer>
        </Container>
    )
    
}

export default LogDetails;
