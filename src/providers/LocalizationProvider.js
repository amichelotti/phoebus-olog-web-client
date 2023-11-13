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
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';

const LocalizationProvider = ({children, ...props}) => {

    return (
        <MuiLocalizationProvider dateAdapter={AdapterMoment} {...props} >
            {children}
        </MuiLocalizationProvider>
    )
}
export default LocalizationProvider