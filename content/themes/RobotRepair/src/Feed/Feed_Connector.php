<?php
/*****************************************************************************
 * Copyright (c) 2011 IOWA, llc dba Wiredrive
 * Author J.O.D. (Joint Operations/Development)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ****************************************************************************/

/**
 * Simple class to wrap curl requests for pulling data from a url.  If
 * a user wants to read off disk, extend this file and overrite the 
 * 'fetchData' call.  An interface would work better but seems unnecessary.
 */
class Feed_Connector 
{

    /**
     * Connection
     * The current curl connection
     * @var CURL_Resource
     */
    protected $connection = null;

    /**
     * @return CURL_Resource
     */
    protected function getConnection()
    {
        return $this->connection;
    }

    /**
     * Initializes the curl connection
     *
     * @return  Feed_Connector
     */
    protected function initialize()
    {
        $this->connection = curl_init();
        return $this;
    }

    /**
     * Closes the curl connection if it is set
     *
     * @return  Feed_Connector
     */
    protected function shutDown()
    {
        $connection = $this->getConnection();
        if (null != $connection) {
            curl_close($connection);
        }
        return $this;
    }

    /**
     * Fetch Data
     * Retrieve data from a url stream using curl
     *
     * @param   string      $url
     * @return  string
     */
    public function fetchData($url)
    {
        if (empty($url)) {
            throw new Exception('Url cannot be empty');
        }
        $response = $this->initialize()
                         ->sendRequest($url);
        if (false === $response) {
            $this->shutDown();
            return false;
        }
        $status = $this->checkStatus();
        if (false === $status) {
            $this->shutDown();
            return false;
        }

        return $response;
    }

    /**
     * Send the url request with the current connection
     *
     * @param   string      $url
     * @return  string
     */
    protected function sendRequest($url)
    {
        $connection = $this->getConnection();
        
        $options = array(
            CURLOPT_URL             => $url,
            CURLOPT_HEADER          => false,
            CURLOPT_RETURNTRANSFER  => true,
        );
        curl_setopt_array($connection, $options);

        return curl_exec($connection);
    }

    /**
     * Check the response header of the current connection to see 
     * the http code.  Only 200 and 304 are allowed.  All others will
     * return false
     *
     * @return  bool
     */
    protected function checkStatus()
    {
        $connection = $this->getConnection();
        $status = curl_getinfo($connection);
        if (! array_key_exists('http_code', $status)) {
            return false;
        }
        $statusCode = $status['http_code'];
        
        $ok             = 200;
        $notModified    = 304;
        $validCodes = array($ok, $notModified);
        if (in_array($statusCode, $validCodes)) {
            return true;
        }
        return false;
    }

    /**
     * Destructor
     */
    public function __destruct()
    {
        $this->shutDown();
    }
}
